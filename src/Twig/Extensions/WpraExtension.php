<?php

namespace RebelCode\Wpra\Core\Twig\Extensions;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use WPRSS_Help;

/**
 * Twig extension for custom WP RSS Aggregator filters.
 *
 * @since 4.13
 */
class WpraExtension extends AbstractExtension
{
    /**
     * {@inheritdoc}
     *
     * @since 4.13
     */
    public function getFilters()
    {
        return [
            $this->getBase64EncodeFilter(),
            $this->getWpraLinkFilter(),
            $this->getWordsLimitFilter(),
            $this->getCloseTagsFilter()
        ];
    }

    /**
     * @inheritdoc
     *
     * @since [*next-version*]
     */
    public function getFunctions()
    {
        return [
            $this->getWpraFunction(),
            $this->getWpraLinkAttrsFunction(),
            $this->getWpNonceFieldFunction(),
            $this->getWpraTooltipFunction(),
            $this->getHtmlEntitiesDecodeFunction(),
        ];
    }

    /**
     * Retrieves the wpra twig function.
     *
     * @since [*next-version*]
     *
     * @return TwigFunction
     */
    protected function getWpraFunction()
    {
        return new TwigFunction('wpra', 'wpra_container');
    }

    /**
     * Retrieves the wp_nonce_field twig function.
     *
     * @since [*next-version*]
     *
     * @return TwigFunction
     */
    protected function getWpNonceFieldFunction()
    {
        return new TwigFunction('wp_nonce_field', 'wp_nonce_field', [
            'is_safe' => ['html'],
        ]);
    }

    /**
     * Retrieves the WPRA tooltip twig function.
     *
     * @since [*next-version*]
     *
     * @return TwigFunction
     */
    protected function getWpraTooltipFunction()
    {
        $options = [
            'is_safe' => ['html'],
        ];

        return new TwigFunction('wpra_tooltip', function ($id, $text = '') {
            $help = WPRSS_Help::get_instance();

            if ($help->has_tooltip($id)) {
                return $help->do_tooltip($id);
            }

            return $help->tooltip($id, $text);
        }, $options);
    }

    /**
     * Retrieves the "wpralink" filter.
     *
     * @since 4.13
     *
     * @return TwigFilter The filter instance.
     */
    protected function getWpraLinkFilter()
    {
        $name = 'wpralink';
        $callback = function ($text, $url, $flag, $options) {
            if (!$flag) {
                return $text;
            }

            return sprintf('<a %s>%s</a>', $this->prepareLinkAttrs($url, $options), $text);
        };
        $options = [
            'is_safe' => ['html'],
        ];

        return new TwigFilter($name, $callback, $options);
    }

    /**
     * Retrieves the "wpra_link_attrs" Twig function.
     *
     * @since [*next-version*]
     *
     * @return TwigFunction The filter instance.
     */
    protected function getWpraLinkAttrsFunction()
    {
        $name = 'wpra_link_attrs';

        return new TwigFunction($name, function ($url, $options, $className = '') {
            return $this->prepareLinkAttrs($url, $options, $className);
        });
    }

    /**
     * Retrieves the "wpra_word_limit" Twig filter.
     *
     * @since [*next-version*]
     *
     * @return TwigFilter The filter instance.
     */
    protected function getWordsLimitFilter()
    {
        $name = 'wpra_word_limit';

        $callback = function ($text, $wordsCount) {
            return wprss_trim_words($text, $wordsCount);
        };

        $options = [
            'is_safe' => ['html'],
        ];

        return new TwigFilter($name, $callback, $options);
    }

    /**
     * Retrieves the "html_decode" Twig function.
     *
     * @since [*next-version*]
     *
     * @return TwigFunction The filter instance.
     */
    protected function getHtmlEntitiesDecodeFunction()
    {
        $name = 'html_decode';

        return new TwigFunction($name, function ($text) {
            return strip_tags(html_entity_decode($text));
        });
    }

    /**
     * Retrieves the "base64_encode" filter.
     *
     * @since [*next-version*]
     *
     * @return TwigFilter The filter instance.
     */
    public function getBase64EncodeFilter()
    {
        $name = 'base64_encode';

        $callback = function ($input) {
            return base64_encode($input);
        };

        return new TwigFilter($name, $callback);
    }

    /**
     * Prepares an HTML link element's attributes, based on the WPRA template options for links.
     *
     * @since [*next-version*]
     *
     * @param string $url       The link URL.
     * @param array  $options   The template options.
     * @param string $className The HTML class(es) to add.
     *
     * @return string The attributes as a string.
     */
    public function prepareLinkAttrs($url, $options, $className = '')
    {
        $openBehavior = isset($options['links_open_behavior'])
            ? $options['links_open_behavior']
            : '';
        $relNoFollow = isset($options['links_rel_nofollow'])
            ? $options['links_rel_nofollow']
            : '';

        $hrefAttr = sprintf('href="%s"', esc_attr($url));
        $relAttr = ($relNoFollow == 'no_follow')
            ? 'rel="nofollow"'
            : '';

        $targetAttr = ($openBehavior === 'blank')
            ? 'target="_blank"'
            : '';

        if ($openBehavior === 'lightbox') {
            $className = trim($className . ' colorbox');
        }

        return sprintf('%s %s %s class="%s"', $hrefAttr, $targetAttr, $relAttr, $className);
    }

    /**
     * Retrieves the "close_tags" Twig filter.
     *
     * @since [*next-version*]
     *
     * @return TwigFilter
     */
    public function getCloseTagsFilter()
    {
        $name = 'close_tags';

        $callback = function ($input) {
            return preg_replace_callback('#<\s*(img|br|hr)\s*([^>]+\s*)>#', function ($matches) {
                return sprintf('<%s %s/>', $matches[1], $matches[2]);
            }, $input);
        };

        return new TwigFilter($name, $callback, [
            'is_safe' => ['html'],
        ]);
    }
}
